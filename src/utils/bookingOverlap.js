// parse YYYY-MM-DD thành timestamp (00:00 local)
function toDayTs(d) {
  if (!d) return NaN
  const [y, m, day] = String(d).split('-').map(Number)
  return new Date(y, (m || 1) - 1, day || 1).getTime()
}

/**
 * Kiểm tra 2 khoảng ngày có overlap không.
 * [aStart, aEnd) và [bStart, bEnd) (end là checkout, không tính chiếm)
 */
export function isDateRangeOverlap(aStart, aEnd, bStart, bEnd) {
  const as = toDayTs(aStart)
  const ae = toDayTs(aEnd)
  const bs = toDayTs(bStart)
  const be = toDayTs(bEnd)

  if (![as, ae, bs, be].every(Number.isFinite)) return false
  if (ae <= as || be <= bs) return false

  return as < be && bs < ae
}

/**
 * Kiểm tra một request đặt phòng có trùng với booking hiện có của cùng roomId không.
 * status: nếu bạn muốn chỉ tính các booking còn hiệu lực, thêm lọc status ở đây.
 */
export function hasRoomConflict({ roomId, checkIn, checkOut, bookings }) {
  const rid = Number(roomId)
  return (bookings || []).some((b) => {
    if (Number(b.roomId) !== rid) return false
    // bạn có thể tùy chọn: bỏ qua booking bị hủy
    if (String(b.status || '').toLowerCase() === 'cancelled') return false

    return isDateRangeOverlap(checkIn, checkOut, b.checkIn, b.checkOut)
  })
}