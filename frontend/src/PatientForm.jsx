import { useState } from 'react'

const today = () => new Date().toLocaleDateString('en-CA') // YYYY-MM-DD in local time

export function validate(v) {
  const e = {}
  if (!v.name.trim()) e.name = 'Name is required'
  else if (!/^[A-Za-z]+( [A-Za-z]+)*$/.test(v.name.trim())) e.name = 'Name must contain letters only'
  if (v.age === '' || v.age === null) e.age = 'Age is required'
  else if (!/^\d+$/.test(String(v.age)) || +v.age < 0 || +v.age > 120) e.age = 'Age must be a number between 0 and 120'
  for (const [k, label] of [['gender', 'Gender'], ['ward', 'Ward'], ['department', 'Department'], ['doctor', 'Doctor']])
    if (!v[k]) e[k] = `${label} is required`
  if (!v.admissionDate) e.admissionDate = 'Admission date is required'
  else if (v.admissionDate > today()) e.admissionDate = 'Admission date cannot be in the future'
  return e
}

const empty = { name: '', age: '', gender: '', ward: '', department: '', doctor: '', admissionDate: '' }

function Field({ label, error, children }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
      {error && <small className="err">{error}</small>}
    </label>
  )
}

export default function PatientForm({ options, patient, onSave, onClose }) {
  const [v, setV] = useState(patient ? { ...empty, ...patient } : empty)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const set = (k) => (e) => setV({ ...v, [k]: e.target.value })

  const select = (k, label, list) => (
    <Field label={label} error={errors[k]}>
      <select value={v[k]} onChange={set(k)}>
        <option value="">Select {label.toLowerCase()}</option>
        {list.map((o) => <option key={o}>{o}</option>)}
      </select>
    </Field>
  )

  async function submit(e) {
    e.preventDefault()
    const found = validate(v)
    setErrors(found)
    if (Object.keys(found).length) return
    setSaving(true)
    setFormError('')
    try {
      await onSave({ ...v, name: v.name.trim(), age: Number(v.age) })
    } catch (err) {
      setErrors(err.fieldErrors || {})
      setFormError(err.message)
      setSaving(false)
    }
  }

  return (
    <div className="overlay" onClick={onClose}>
      <form className="glass modal" onClick={(e) => e.stopPropagation()} onSubmit={submit} noValidate>
        <h2>{patient ? 'Edit patient' : 'Add patient'}</h2>
        <div className="grid">
          <Field label="Name" error={errors.name}>
            <input value={v.name} onChange={set('name')} placeholder="Full name" />
          </Field>
          <Field label="Age" error={errors.age}>
            <input type="number" min="0" max="120" value={v.age} onChange={set('age')} placeholder="0 – 120" />
          </Field>
          {select('gender', 'Gender', options.genders)}
          {select('ward', 'Ward', options.wards)}
          {select('department', 'Department', options.departments)}
          {select('doctor', 'Doctor', options.doctors)}
          <Field label="Admission date" error={errors.admissionDate}>
            <input type="date" max={today()} value={v.admissionDate} onChange={set('admissionDate')} />
          </Field>
        </div>
        {formError && !Object.keys(errors).length && <p className="err">{formError}</p>}
        <div className="actions">
          <button type="button" className="btn ghost" onClick={onClose}>Cancel</button>
          <button className="btn primary" disabled={saving}>{saving ? 'Saving…' : 'Save patient'}</button>
        </div>
      </form>
    </div>
  )
}
