import assert from "node:assert";


export function assertMock(mockObject) {
  return {
    wasCalledWith(arg) {
      const firstCallFirstArgument = mockObject.mock.calls[0].arguments[0]
      assert.deepStrictEqual(firstCallFirstArgument, arg)
    }
  }
}