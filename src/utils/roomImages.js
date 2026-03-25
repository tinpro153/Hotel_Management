// Đồng bộ tuyệt đối giữa Home / Rooms / RoomDetail:
// roomCover(room) luôn trả về ảnh đầu của roomGallery(room)

export function roomGallery(room, count = 5) {
  if (!room) return []
  if (Array.isArray(room.images) && room.images.length) return room.images

  // Dùng room.id làm seed cố định để ảnh luôn giống nhau
  return Array.from({ length: count }, (_, i) => {
    const seed = `${room.id}-${i}`
    // ✅ LoremFlickr: /width/height/category?seed=
    return `https://loremflickr.com/1200/700/hotel,landscape?seed=${seed}`
  })
}

export function roomCover(room) {
  if (!room) return ''
  if (room.image) return room.image
  if (Array.isArray(room.images) && room.images.length) return room.images[0]

  // ✅ cover = gallery[0] (cùng URL để chắc chắn giống)
  return roomGallery(room, 5)[0]
}