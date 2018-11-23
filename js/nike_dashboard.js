function printMessage(msg) {
  console.log(msg)
}

chrome.runtime.onMessage.addListener(msg => {
  let p = document.querySelector("p")
  p.textContent = msg.msg
  console.log(msg)
})