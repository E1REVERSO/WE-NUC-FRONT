exports.main = async (t) => {
  t = parseInt(t)
  t += 10554144

  let c = t.toString()
  let d = c.substring(0, 8) + "14" + c.substring(8)

  let ch = ''
  for (let i = d.length - 1; i >= 0; i--) {
    ch = d[i]
    if (ch != '0') {
      break
    }
  }

  d = parseInt(d)
  let temp = "" + parseInt(ch * d)

  return temp.substring(1)
}