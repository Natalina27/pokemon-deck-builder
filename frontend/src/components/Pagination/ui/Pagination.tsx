import styles from './Pagination.module.css'

interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

const Pagination = ({ page, totalPages, onPageChange }: PaginationProps) => {
  if (totalPages <= 1) return null

  return (
    <nav className={styles.pagination} aria-label="Cards pagination">
      <button
        type="button"
        className={styles.pageBtn}
        disabled={page <= 1}
        onClick={() => onPageChange(1)}
        aria-label="First page"
      >
        First
      </button>
      <button
        type="button"
        className={styles.pageBtn}
        disabled={page <= 1}
        onClick={() => onPageChange(Math.max(1, page - 1))}
      >
        Previous
      </button>
      <span className={styles.pageInfo}>
        {page} / {totalPages}
      </span>
      <button
        type="button"
        className={styles.pageBtn}
        disabled={page >= totalPages}
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
      >
        Next
      </button>
      <button
        type="button"
        className={styles.pageBtn}
        disabled={page >= totalPages}
        onClick={() => onPageChange(totalPages)}
        aria-label="Last page"
      >
        Last
      </button>
    </nav>
  )
}

export default Pagination
