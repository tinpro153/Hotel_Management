export function buildVietQrUrl({ bankName, bankAccount, accountHolder, amount, addInfo }) {
  // compact2.png là template phổ biến của vietqr.io
  // bankName ví dụ: VCB, ACB, BIDV, MBBANK...
  // bankAccount: số tài khoản
  // accountHolder: tên chủ tài khoản
  const a = Number(amount || 0)
  const info = addInfo || ''
  const holder = accountHolder || ''

  return `https://img.vietqr.io/image/${bankName}-${bankAccount}-compact2.png?amount=${a}&addInfo=${encodeURIComponent(info)}&accountName=${encodeURIComponent(holder)}`
}