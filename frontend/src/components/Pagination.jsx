export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  onPageSizeChange,
  totalItems,
}) {
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const handleFirstPage = () => {
    if (currentPage > 1) {
      onPageChange(1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handleLastPage = () => {
    if (currentPage < totalPages) {
      onPageChange(totalPages);
    }
  };

  const handlePageSizeChange = (e) => {
    const newSize = parseInt(e.target.value, 10);
    onPageSizeChange(newSize);
  };

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages = [];
    const showPages = 5;
    let start = Math.max(1, currentPage - Math.floor(showPages / 2));
    const end = Math.min(totalPages, start + showPages - 1);

    if (end - start < showPages - 1) {
      start = Math.max(1, end - showPages + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  if (totalPages <= 1 && totalItems <= 10) {
    return null;
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--spacing-md)",
        alignItems: "center",
        marginTop: "var(--spacing-xl)",
        padding: "var(--spacing-lg)",
        background: "white",
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-md)",
      }}
    >
      {/* Items info */}
      <div
        style={{
          color: "var(--text-muted)",
          fontSize: "0.9rem",
        }}
      >
        Showing {startItem}-{endItem} of {totalItems} trails
      </div>

      {/* Pagination controls */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--spacing-sm)",
        }}
      >
        {/* First page button */}
        <button
          onClick={handleFirstPage}
          disabled={currentPage === 1}
          aria-label="First page"
          style={{
            padding: "8px 12px",
            border: "2px solid #e2e8f0",
            borderRadius: "var(--radius-sm)",
            background: currentPage === 1 ? "#f7fafc" : "white",
            cursor: currentPage === 1 ? "not-allowed" : "pointer",
            opacity: currentPage === 1 ? 0.5 : 1,
            transition: "var(--transition-fast)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="11 17 6 12 11 7"></polyline>
            <polyline points="18 17 13 12 18 7"></polyline>
          </svg>
        </button>

        {/* Previous page button */}
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          aria-label="Previous page"
          style={{
            padding: "8px 12px",
            border: "2px solid #e2e8f0",
            borderRadius: "var(--radius-sm)",
            background: currentPage === 1 ? "#f7fafc" : "white",
            cursor: currentPage === 1 ? "not-allowed" : "pointer",
            opacity: currentPage === 1 ? 0.5 : 1,
            transition: "var(--transition-fast)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>

        {/* Page numbers */}
        {getPageNumbers().map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            aria-label={`Page ${page}`}
            aria-current={page === currentPage ? "page" : undefined}
            style={{
              padding: "8px 14px",
              border: page === currentPage ? "2px solid var(--forest-green)" : "2px solid #e2e8f0",
              borderRadius: "var(--radius-sm)",
              background: page === currentPage ? "var(--bg-gradient-1)" : "white",
              color: page === currentPage ? "white" : "var(--text-primary)",
              cursor: "pointer",
              fontWeight: page === currentPage ? "600" : "400",
              transition: "var(--transition-fast)",
              minWidth: "40px",
            }}
          >
            {page}
          </button>
        ))}

        {/* Next page button */}
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          aria-label="Next page"
          style={{
            padding: "8px 12px",
            border: "2px solid #e2e8f0",
            borderRadius: "var(--radius-sm)",
            background: currentPage === totalPages ? "#f7fafc" : "white",
            cursor: currentPage === totalPages ? "not-allowed" : "pointer",
            opacity: currentPage === totalPages ? 0.5 : 1,
            transition: "var(--transition-fast)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>

        {/* Last page button */}
        <button
          onClick={handleLastPage}
          disabled={currentPage === totalPages}
          aria-label="Last page"
          style={{
            padding: "8px 12px",
            border: "2px solid #e2e8f0",
            borderRadius: "var(--radius-sm)",
            background: currentPage === totalPages ? "#f7fafc" : "white",
            cursor: currentPage === totalPages ? "not-allowed" : "pointer",
            opacity: currentPage === totalPages ? 0.5 : 1,
            transition: "var(--transition-fast)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="13 17 18 12 13 7"></polyline>
            <polyline points="6 17 11 12 6 7"></polyline>
          </svg>
        </button>
      </div>

      {/* Page size selector */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--spacing-sm)",
        }}
      >
        <label
          htmlFor="pageSize"
          style={{
            color: "var(--text-muted)",
            fontSize: "0.9rem",
          }}
        >
          Trails per page:
        </label>
        <select
          id="pageSize"
          value={pageSize}
          onChange={handlePageSizeChange}
          style={{
            padding: "6px 12px",
            border: "2px solid #e2e8f0",
            borderRadius: "var(--radius-sm)",
            background: "white",
            cursor: "pointer",
            fontSize: "0.9rem",
          }}
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>
    </div>
  );
}
