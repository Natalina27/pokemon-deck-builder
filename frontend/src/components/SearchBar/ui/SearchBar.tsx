import styles from './SearchBar.module.css'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

const SearchBar = ({ value, onChange }: SearchBarProps) => {
  return (
    <input
      id="search"
      name="search"
      className={styles.input}
      type="text"
      placeholder="Search cards..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}

export default SearchBar
