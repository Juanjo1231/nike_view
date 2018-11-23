(function initial() {
  console.clear()
  console.log("Genesys Content Script.");

  const PORT = chrome.runtime.connect({name: "nike_port"})
  //PORT.postMessage({msg: "Message from Nike Dashboard. 1"})
  
  function getAgents() {
    let rows   = document.querySelectorAll(".slick-row");
    let agents = {}
    
    Object.defineProperty(agents, "length", {value: 0, writable: true, enumerable: false})

    rows.forEach(row => {
      let arr  = row.children;
      if(arr.length === 4) {
        let name   = arr[0].textContent;
        let reason = arr[1].textContent;
        let time   = arr[2].textContent;
        let login  = arr[3].textContent; 

        let key = name.toLowerCase().replace(/,[\s]+/g, "_")
        agents[key] = {name, reason, time, login}
        agents.length += 1
      }
    })

    return agents;
  }
  

  PORT.postMessage({msg: "New agents", agents: agents, agents_count: agents.length})
})()