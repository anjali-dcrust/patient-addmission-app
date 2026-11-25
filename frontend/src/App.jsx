import { useEffect, useState } from 'react'
import { api } from './api'
import PatientForm from './PatientForm.jsx'

const noFilters = { search: '', ward: '', department: '', doctor: '', status: '' }

export default function App() {
  const [options, setOptions] = useState(null)
  const [patients, setPatients] = useState([])
  const [filters, setFilters] = useState(noFilters)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState(null)          // null | 'new' | patient
  const [toDelete, setToDelete] = useState(null)
  const [toast, setToast] = useState('')

  const notify = (m) => { setToast(m); setTimeout(() => setToast(''), 2500) }

  useEffect(() => {
    api.options().then(setOptions).catch(() => setError('Cannot reach the server. It may be waking up — retry in a few seconds.'))
  }, [])

  useEffect(() => {
    const t = setTimeout(load, 250)
    return () => clearTimeout(t)
  }, [filters])

  async function load() {
    try {
      setError('')
      setPatients(await api.list(filters))
    } catch (e) {
      setError(e.message === 'Failed to fetch' ? 'Cannot reach the server. It may be waking up — retry in a few seconds.' : e.message)
    } finally {
      setLoading(false)
    }
  }

  async function save(data) {
    if (form === 'new') await api.create(data)
    else await api.update(form.id, data)
    notify(form === 'new' ? 'Patient added' : 'Patient updated')
    setForm(null)
    load()
  }

  async function discharge(p) {
    try { await api.discharge(p.id); notify('Patient discharged'); load() } catch (e) { notify(e.message) }
  }

  async function confirmDelete() {
    try { await api.remove(toDelete.id); notify('Patient deleted'); setToDelete(null); load() } catch (e) { notify(e.message) }
  }

  const setF = (k) => (e) => setFilters({ ...filters, [k]: e.target.value })
  const filterSelect = (k, label, list) => (
    <select value={filters[k]} onChange={setF(k)} aria-label={label}>
      <option value="">All {label.toLowerCase()}s</option>
      {list.map((o) => <option key={o}>{o}</option>)}
    </select>
  )
  const filtered = Object.values(filters).some(Boolean)

  return (
    <>
      <div className="blob b1" /><div className="blob b2" />
      <main className="wrap">
        <header className="top">
          <div>
            <h1>Patient admissions</h1>
            <p className="muted">{patients.length} {patients.length === 1 ? 'patient' : 'patients'}{filtered ? ' match your filters' : ' on record'}</p>
          </div>
          <button className="btn primary" disabled={!options} onClick={() => setForm('new')}>Add patient</button>
        </header>

        <section className="glass filters">
          <input type="search" placeholder="Search by name" value={filters.search} onChange={setF('search')} aria-label="Search by name" />
          {options && <>
            {filterSelect('ward', 'Ward', options.wards)}
            {filterSelect('department', 'Department', options.departments)}
            {filterSelect('doctor', 'Doctor', options.doctors)}
            {filterSelect('status', 'Status', options.statuses)}
          </>}
          {filtered && <button className="btn ghost" onClick={() => setFilters(noFilters)}>Clear</button>}
        </section>

        {error && <p className="glass notice err">{error}</p>}
        {loading && !error && <p className="muted center">Loading patients…</p>}
        {!loading && !error && patients.length === 0 && (
          <p className="glass notice center">{filtered ? 'No patients match these filters.' : 'No patients yet. Add the first admission.'}</p>
        )}

        <section className="cards">
          {patients.map((p) => (
            <article key={p.id} className="glass card">
              <div className="row">
                <h3>{p.name}</h3>
                <span className={`pill ${p.status === 'Admitted' ? 'in' : 'out'}`}>{p.status}</span>
              </div>
              <p className="muted">{p.age} yrs, {p.gender}</p>
              <dl>
                <div><dt>Ward</dt><dd>{p.ward}</dd></div>
                <div><dt>Department</dt><dd>{p.department}</dd></div>
                <div><dt>Doctor</dt><dd>{p.doctor}</dd></div>
                <div><dt>Admitted</dt><dd>{new Date(p.admissionDate + 'T00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</dd></div>
              </dl>
              <div className="actions">
                {p.status === 'Admitted' && <button className="btn soft" onClick={() => discharge(p)}>Discharge</button>}
                <button className="btn soft" onClick={() => setForm(p)}>Edit</button>
                <button className="btn danger" onClick={() => setToDelete(p)}>Delete</button>
              </div>
            </article>
          ))}
        </section>
      </main>

      {form && options && <PatientForm options={options} patient={form === 'new' ? null : form} onSave={save} onClose={() => setForm(null)} />}

      {toDelete && (
        <div className="overlay" onClick={() => setToDelete(null)}>
          <div className="glass modal small" role="alertdialog" onClick={(e) => e.stopPropagation()}>
            <h2>Delete {toDelete.name}?</h2>
            <p className="muted">This permanently removes the patient record and cannot be undone.</p>
            <div className="actions">
              <button className="btn ghost" onClick={() => setToDelete(null)}>Keep patient</button>
              <button className="btn dangerSolid" onClick={confirmDelete}>Delete patient</button>
            </div>
          </div>
        </div>
      )}
      {toast && <div className="toast" role="status">{toast}</div>}
    </>
  )
}
