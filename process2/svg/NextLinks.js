import findIndex from 'lodash/findIndex'
class LN {
  constructor ({id, type, next, mirror}) {
    this.id = id
    this.type = type
    this.next = next ? next.map(obj => obj instanceof LN ? obj : new LN(obj)) : []
    this.mirror = !!mirror
  }
  append (ln) {
    if (this.id === ln.id) {
      if (!this.hasNext(ln.next)) {
        this.next = this.next.concat(ln.next)
        return true
      }
    } else {
      let appendSuccessNum = !this.next.every(lnObj => !lnObj.append(ln.clone()))
      return appendSuccessNum
    }
  }
  hasNext (next) {
    return next.some(childLn => {
      return this.next.some(ln => ln.id === childLn.id)
    })
  }
  // 插入到尾部
  push (ln) {
    if (this.id === ln.id) {
      return
    }
    if (this.next.length > 0) {
      return this.next.some(nextLn => {
        return nextLn.push(ln)
      })
    } else {
      this.next.push(ln)
      return true
    }
  }
  clone () {
    return new LN({
      id: this.id,
      type: this.type,
      mirror: this.mirror,
      next: this.next.map(ln => ln.clone())
    })
  }
  cloneSingle () {
    const ins = this.clone()
    ins.next = []
    return ins
  }
}
// linksNet 结构
// const example = [
//   {
//     from: {id: 2, type: 0},
//     to: {id: 3, type: 0}
//   },
//   {
//     from: {id: 0, type: 0},
//     to: {id: 1, type: 0}
//   },
//   {
//     from: {id: 1, type: 0},
//     to: {id: 2, type: 0}
//   }
// ]

function mergeLn (lnArr) {
  let result = []
  let init = lnArr

  while (1) {
    result = init.reduce((pre, next) => {
      // console.log((JSON.stringify(pre, null, 2)));

      if (pre.length) {
        let isAppend = !pre.every(ln => !ln.append(next))
        if (isAppend) {
          return pre
        } else {
          pre = pre.filter(ln => !next.append(ln))
          return pre.concat(next)
        }
      } else {
        return [next]
      }
    }, [])
    if (init.length === result.length) {
      break
    } else {
      init = result
    }
  }
  return result
}
// 拆分多个单链表
function splitLnNode (cur, currentLinkStartLn, singlenodeTree = []) {
  if (cur.next.length > 0) {
    let first = cur.next[0]
    if (cur.next.length > 1) {
      cur.next.slice(1).forEach(nextLn => {
        const branch2 = currentLinkStartLn.clone()
        singlenodeTree.push(branch2)
        branch2.push(nextLn.cloneSingle())
        splitLnNode(nextLn, branch2, singlenodeTree)
      })
    }
    currentLinkStartLn.push(first.cloneSingle())
    splitLnNode(first, currentLinkStartLn, singlenodeTree)
  }
  return singlenodeTree
}

function countDisplayNum (nodeTree, idCountMap) {
  nodeTree.forEach(ln => {
    idCountMap[ln.id] = ln.next.length
    countDisplayNum(ln.next, idCountMap)
  })
}

function findType (nodeTree, type) {
  let r = nodeTree.some(o => o.type === type)
  if (!r) {
    r = nodeTree.some(o => findType(o.next, type))
  }
  return r
}

function findTypeOnSingleLink (startNode, prevType, endType) {
  // 都找到了
  if (!prevType && !endType) {
    return true
  }
  // 后面找到了，还没找到前面
  if (prevType && !endType) {
    return false
  }
  // 到底了还没找全
  if ((prevType || endType) && !startNode) {
    return false
  }
  if (prevType) {
    prevType = startNode.type === prevType ? false : prevType
  }
  if (endType) {
    endType = startNode.type === endType ? false : endType
  }
  return findTypeOnSingleLink(startNode.next[0], prevType, endType)
}
/*
[a -> c] [ b -> c] [c -> d]
完整为
[a -> c] [ b -> c] [c -> d] [c -> d, mirror]
*/
function completeConnections (connections, isRerverse) {
  if (isRerverse) {
    connections = connections.map(obj => {
      return {
        ...obj,
        from: obj.to,
        to: obj.from
      }
    })
  }

  const originConnections = connections.slice()
  const resultConnections = connections.slice()

  let countTo = {}
  originConnections.forEach(({from, to}) => {
    if (typeof countTo[to.id] === 'undefined') {
      countTo[to.id] = -1
    }
    countTo[to.id] += 1
  })
  let countToArr = Object.keys(countTo).filter(id => {
    return countTo[id] > 0
  }).map(id => ({id: parseInt(id), count: countTo[id]}))

  while (countToArr.length > 0) {
    let willCountToArr = []
    originConnections.forEach(({from, to}) => {
      let fi = findIndex(countToArr, { id: from.id })
      if (fi === -1) {
      } else {
        let countToObj = countToArr[fi]
        let i = 0
        while (i < countToObj.count) {
          resultConnections.push({
            from: {
              ...from
            },
            to: {
              ...to
            },
            mirror: true // 防止被覆盖
          })
          i++
        }
        willCountToArr.push({
          id: to.id,
          count: countToObj.count
        })
      }
    })
    countToArr = willCountToArr.slice()
    if (willCountToArr.length === 0) {
      break
    }
  }

  // console.log(`resultConnections:`, resultConnections);

  return resultConnections
}

function buildTree (connections, allLn, isRerverse) {
  let nodeTree = []

  // 多重链路的情况下复制connections的关系
  connections = completeConnections(connections, isRerverse)

  connections.forEach(({from, to, mirror}, i) => {
    allLn = allLn.filter(o => o.id !== from.id && o.id !== to.id)

    if (isRerverse) {
      [from, to] = [to, from]
    }

    const newLn = new LN({
      ...from,
      next: [to],
      mirror
    })
    let isAppend = !nodeTree.every(ln => {
      const r = ln.append(newLn.clone())
      return !r
    })

    // console.log((JSON.stringify(nodeTree, null, 2)));
    if (isAppend) {
      nodeTree = mergeLn(nodeTree)
    } else {
      nodeTree = nodeTree.concat(newLn)
    }
    // console.log((JSON.stringify(nodeTree, null, 2)), (JSON.stringify(newLn)), isAppend);
    // console.log((JSON.stringify(nodeTree, null, 2)), isAppend);
    // console.log(i, '__')
  })
  return nodeTree.concat(allLn)
}

function findNodeById (tree, id) {
  let ln = tree.filter(ln => String(ln.id) === String(id))[0]
  if (!ln) {
    ln = tree.map(ln => {
      return findNodeById(ln.next, id)
    }).filter(_ => _)[0]
  }
  return ln
}

export default class NextLink {
  constructor (connections, allNodes) {
    let allLn = allNodes.map(o => new LN(o))
    let nodeTree = mergeLn(buildTree(connections, allLn)) //
    let nodeTreeReverse = mergeLn(buildTree(connections, allLn, true)) // 方向相反

    console.log(nodeTreeReverse)
    this.connections = connections
    this.nodeTreeReverse = nodeTreeReverse
    this.nodeTree = nodeTree
    this.singlenodeTree = nodeTree.map(ln => {
      const startLn = ln.cloneSingle()
      return splitLnNode(ln, startLn, [startLn])
    }).reduce((pre, next) => {
      return pre.concat(next)
    }, [])
  }
  getSimpleConnections () {
    const idsNextMap = {}
    const idsNextMapReverse = {}

    // 为所有的尾部增加 { current: 尾巴，next: null}
    let tailNodeIdSet = new Set()
    this.connections.forEach(obj => {
      tailNodeIdSet.add(String(obj.to.id))
    })
    this.connections.forEach(obj => {
      tailNodeIdSet.delete(String(obj.from.id))
    })

    const myConnectiosn = this.connections.concat(this.connections.map(obj => {
      return tailNodeIdSet.has(String(obj.to.id)) ? {
        from: {
          id: obj.to.id
        },
        to: null
      } : null
    }).filter(_ => _))

    myConnectiosn.forEach(obj => {
      if (!idsNextMap[obj.from.id]) {
        idsNextMap[obj.from.id] = {
          nodeId: obj.from.id,
          prevNextIds: [],
          nextNodeIds: []
        }
      }
      if (obj.to && !idsNextMapReverse[obj.to.id]) {
        idsNextMapReverse[obj.to.id] = {
          nodeId: obj.to.id,
          nextNodeIds: []
        }
      }
      if (obj.to) {
        idsNextMap[obj.from.id].nextNodeIds.push(obj.to.id)
        idsNextMapReverse[obj.to.id].nextNodeIds.push(obj.from.id)
      }
    })

    Object.keys(idsNextMap).forEach(id => {
      if (idsNextMapReverse[id]) {
        idsNextMap[id].prevNextIds = idsNextMapReverse[id].nextNodeIds
      }
    })
    // debugger;

    return Object.values(idsNextMap).map(obj => ({
      nodeId: obj.nodeId,
      prevNextIds: obj.prevNextIds.join(','),
      nextNodeIds: obj.nextNodeIds.join(',')
    }))
  }
  getMultiNext (isRerverse) {
    const tree = isRerverse ? this.nodeTreeReverse : this.nodeTree
    const a = {}
    countDisplayNum(tree, a)
    const lnArr = Object.keys(a).map((id) => {
      return a[id] > 1 ? id : null
    }).filter(_ => _)
    return lnArr
  }
  getNext (id, isRerverse) {
    const ln = findNodeById(isRerverse ? this.nodeTreeReverse : this.nodeTree, id)
    return ln ? ln.next.slice() : []
  }
  hasTypes (types) {
    return [].concat(types).every(type => findType(this.nodeTree, type))
  }
  findTypeBefore (prevType, endType) {
    // console.log('==>', endType);
    let r = this.singlenodeTree.filter(startNode => {
      return findType([startNode], endType)
    }).some(startNode => {
      const r = findTypeOnSingleLink(startNode, prevType, endType)
      // console.log(r, startNode, prevType, endType);
      return r
    })
    return r
  }
  existsTypeInSingle (type) {
    return this.singlenodeTree.every(startNode => {
      return findType([startNode], type)
    })
  }
}
