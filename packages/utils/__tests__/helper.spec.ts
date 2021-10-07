import { globalVar, ToStringTypes } from '@mitojs/shared'
import {
  defaultFunctionName,
  generateUUID,
  getBigVersion,
  getFunctionName,
  getLocationHref,
  getTimestamp,
  on,
  replaceOld,
  throttle,
  toStringValidateOption,
  unknownToString,
  silentConsoleScope
} from '../src/index'

describe('helper.ts', () => {
  it('should getLocationHref func work', () => {
    expect(getLocationHref()).toBe('http://localhost/')
  })
  it('should on func work', () => {
    const div = document.createElement('div')
    let flag = false
    on(div, 'click', () => {
      flag = true
    })
    div.click()
    expect(flag).toBeTruthy()
  })

  it('should replaceOld func work', () => {
    const obj = {
      fn: function (num: number) {
        return 1 + num
      }
    }
    const params = 6
    // before
    expect(obj.fn(params)).toBe(7)
    replaceOld(obj, 'fn', (originFn) => {
      return function (num: number) {
        expect(num).toBe(params)
        return originFn(num)
      }
    })
    obj.fn(params)
    // after
    expect(obj.fn(params)).toBe(7)
  })

  it('should getFunctionName func work', () => {
    function test1() {}
    expect(getFunctionName(test1)).toBe('test1')
    expect(getFunctionName({})).toBe(defaultFunctionName)
    expect(getFunctionName(null)).toBe(defaultFunctionName)
  })

  it('should throttle func work', (done) => {
    let count = 0
    function add() {
      count++
    }
    const throttledAdd = throttle(add, 400)
    throttledAdd()
    throttledAdd()
    throttledAdd()
    setTimeout(() => {
      throttledAdd()
      throttledAdd()
      expect(count).toBe(2)
      done()
    }, 1000)
  })

  it('should getTimestamp func work', () => {
    expect(typeof getTimestamp() === 'number').toBeTruthy()
  })

  it('should toStringValidateOption func work', () => {
    expect(toStringValidateOption({}, 'key1', ToStringTypes.Object)).toBeTruthy()
    expect(toStringValidateOption(1, 'key2', ToStringTypes.Number)).toBeTruthy()
    expect(toStringValidateOption({}, 'key3', ToStringTypes.Array)).toBeFalsy()
  })

  it('should silentConsoleScope func work', () => {
    expect(globalVar.isLogAddBreadcrumb).toBeTruthy()
    function validate() {
      expect(globalVar.isLogAddBreadcrumb).toBeFalsy()
    }
    silentConsoleScope(validate)
  })

  it('should generateUUID func work', () => {
    const uuiid1 = generateUUID()
    const uuiid2 = generateUUID()
    expect(uuiid1).not.toBe(uuiid2)
  })

  it('should unknownToString func work', () => {
    const test1 = 'abc'
    const test2 = { data: 'test' }
    const test3 = [1, 2, 3]
    expect(unknownToString(test1)).toBe(test1)
    expect(unknownToString(test2)).toBe(JSON.stringify(test2))
    expect(unknownToString(test3)).toBe(JSON.stringify(test3))
    expect(unknownToString(undefined)).toBe('undefined')
    expect(unknownToString(null)).toBe('null')
  })

  it('should getBigVersion func work', () => {
    expect(getBigVersion('0.6.1')).toBe(0)
    expect(getBigVersion('2.6.1')).toBe(2)
    expect(getBigVersion('3.0.4')).toBe(3)
  })
})
