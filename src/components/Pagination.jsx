import { useMemo } from 'react'
import { Pagination } from 'react-bootstrap'
import "./Pagination.css";

const range = (start, end) => {
  let length = end - start + 1
  return Array.from({ length }, (_, idx) => idx + start)
}
const usePagination = ({
  totalCount,
  pageSize,
  siblingCount = 1,
  currentPage
}) => {
  const paginationRange = useMemo(() => {
    const totalPageCount = Math.ceil(totalCount / pageSize)
    const totalPageNumbers = siblingCount + 5
    if (totalPageNumbers >= totalPageCount) {
      return range(1, totalPageCount)
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1)
    const rightSiblingIndex = Math.min(
      currentPage + siblingCount,
      totalPageCount
    )

    const shouldShowLeftDots = leftSiblingIndex > 2
    const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2

    const firstPageIndex = 1
    const lastPageIndex = totalPageCount

    if (!shouldShowLeftDots && shouldShowRightDots) {
      let leftItemCount = 3 + 2 * siblingCount
      let leftRange = range(1, leftItemCount)

      return [...leftRange, 'DOTS', totalPageCount]
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      let rightItemCount = 3 + 2 * siblingCount
      let rightRange = range(
        totalPageCount - rightItemCount + 1,
        totalPageCount
      )
      return [firstPageIndex, 'DOTS', ...rightRange]
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      let middleRange = range(leftSiblingIndex, rightSiblingIndex)
      return [firstPageIndex, 'DOTS', ...middleRange, 'DOTS', lastPageIndex]
    }
  }, [totalCount, pageSize, siblingCount, currentPage])

  return paginationRange
}

const CPagination = props => {
  const {
    search,
    pagination,
    onChange,
    siblingCount = 1,
    className
  } = props

  const paginationRange = usePagination({
    currentPage: pagination.page,
    totalCount: pagination.totalCount,
    pageSize: pagination.pageSize,
    siblingCount
  })
  if (pagination.page === 0 || paginationRange.length < 1) {
    return null
  }
  let lastPage = paginationRange[paginationRange.length - 1]

  const onFirst = () => {
    onChange({search, pagination: {...pagination, page: 1}});
  }
  const onNext = () => {
    if (pagination.page < lastPage) {
      onChange({search, pagination: {...pagination, page: pagination.page + 1}});
    }
  }

  const onPrevious = () => {
    if (pagination.page > 1) {
      onChange({search, pagination: {...pagination, page: pagination.page - 1}});
    }
  }
  const onLast = () => {
    onChange({search, pagination: {...pagination, page: lastPage}});
  }

  return (
    <Pagination className={className}>
      <Pagination.First onClick={onFirst} />
      <Pagination.Prev onClick={onPrevious} />
      {paginationRange.map((pageNumber, idx) => {
        if (pageNumber === 'DOTS') {
          return <Pagination.Ellipsis key={idx} />
        }
        if (pagination.page === pageNumber) {
          return (
            <Pagination.Item
              key={idx}
              active
              onClick={() => onChange({search, pagination: {...pagination, page: pageNumber}})}
            >
              {pageNumber}
            </Pagination.Item>
          )
        } else {
          return (
            <Pagination.Item key={idx} onClick={() => onChange({search, pagination: {...pagination, page: pageNumber}})}>
              {pageNumber}
            </Pagination.Item>
          )
        }
      })}
      <Pagination.Next onClick={onNext} />
      <Pagination.Last onClick={onLast} />
    </Pagination>
  )
}
export default CPagination
