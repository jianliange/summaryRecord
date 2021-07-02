function add(items) {
  let parent = document.getElementsByTagName('tbody')[0]
  let node = `<tr><td>${items.name}</td><td>${items.price}</td><td><a href="javascript:void(0);">删除</a></td></tr>`
  parent.appendChild(node)
}

function bind() {
    
}

