// Đồng bộ tuyệt đối giữa Home / Rooms / RoomDetail:
// roomCover(room) luôn trả về ảnh đầu của roomGallery(room)

export function roomGallery(room, count = 5) {
  if (!room) return []
  if (Array.isArray(room.images) && room.images.length) return room.images

  return Array.from({ length: count }, (_, i) => {
    const idx = i + 1
    // ✅ seed thống nhất cho gallery
    return `https://picsum.photos/seed/room-${room.id}-${idx}/1200/700`
  })
}

export function roomCover(room) {
  if (!room) return ''
  if (room.image) return room.image
  if (Array.isArray(room.images) && room.images.length) return room.images[0]

  // ✅ cover = gallery[0] (cùng URL để chắc chắn giống)
  return roomGallery(room, 5)[0]
}