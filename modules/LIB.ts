class Lib {
  private totalMessagesLength(messagesArray) {
    let result = 0
    _.forEach(messagesArray, (message) => {
      result += message.content.split(" ").length
    })
    return result
  }
  limitMessegesLength(messagesArray, max = 1024) {
    let totalLength = this.totalMessagesLength(messagesArray)
    let counter = 0
    while (totalLength > max && counter < 100) {
      counter++
      // Remove the second item
      if (messagesArray.length > 1) messagesArray.splice(1, 1)
      totalLength = this.totalMessagesLength(messagesArray)
    }
    return messagesArray
  }
  mergeArrays(arr1: any[], arr2: any[]): any[] {
    let result: any[] = []
    let i = 0
    while (arr1.length > 0 || arr2.length > 0) {
      if (arr1.length > 0) {
        result = result.concat(arr1.splice(0, i + 1))
      }
      if (arr2.length > 0) {
        result = result.concat(arr2.splice(0, i + 1))
      }
      i++
    }
    return result
  }
  addGetter(object: AnyObject, name: string, fn: () => any) {
    Object.defineProperty(object, name, {
      get: fn,
      enumerable: true,
      configurable: true,
    })
  }
  /** @returns string of time for example "22:43:54" */
  timeNow(): string {
    function _pad(num: number): string {
      return String(num).padStart(2, "0")
    }
    const now = new Date()
    const current: string =
      _pad(now.getHours()) +
      ":" +
      _pad(now.getMinutes()) +
      ":" +
      _pad(now.getSeconds())
    return current
  }
  logWarning(message: string) {
    console.log("❗ " + this.timeNow() + ": " + message)
  }
  cloneMapDeep(map: Map<any, any>) {
    const clonedMap = new Map()
    map.forEach((value, key) => {
      if (value instanceof Map) {
        clonedMap.set(key, this.cloneMapDeep(value))
      } else {
        clonedMap.set(key, _.cloneDeep(value))
      }
    })
    return clonedMap
  }
  deadZoneExceed(deadZone: number) {
    const axes: number[] = [INPUT.gamepad.axes[0], INPUT.gamepad.axes[1]]
    let moved = false

    axes.forEach((axis: number) => {
      if (Math.abs(axis) > deadZone) {
        moved = true
      }
    })
    return moved
  }
  /** @returns array of sorted keys of object by descendant order of its number values, for example {a: -1, b: 1, c: 2} became ["c", "b", "a"]" */
  sortedKeys(object) {
    return _.sortBy(_.keys(object), (key) => -object[key])
  }
  generateRandomString(length) {
    let result = ""
    for (let i = 0; i < length; i++) {
      // Generate a random number between 0 and 9
      const randomNumber = _.random(0, 9)
      // Convert the number to a string and add it to the result
      result += randomNumber.toString()
    }
    return result
  }
  /** transform an object into reactive pinia store, ignores but saves init */
  store(object: AnyObject) {
    const functions = {}
    _.forEach(object, (value, key) => {
      if (typeof value === "function") {
        functions[key] = value
        delete object[key]
      }
    })
    const storeObject: AnyObject = {}
    storeObject.state = defineStore(this.generateRandomString(10), {
      state: () => object,
    })
    _.forEach(object, (value, key) => {
      Object.defineProperty(storeObject, key, {
        get: () => storeObject.state()[key],
        set: (value) => {
          storeObject.state()[key] = value
        },
      })
    })
    _.forEach(functions, (value, key) => {
      storeObject[key] = value
    })
    return storeObject
  }
}

export const LIB = new Lib()
