import { computeScriptHash } from '../src'

describe("computeScriptHash", () => {
  test("basic", () => {
    const fixture: { script: CKBComponents.Script, expected: string } = {
      script: {
        codeHash: "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
        hashType: "type",
        args: "0x36c329ed630d6ce750712a477543672adab57f4c",
      },
      expected: "0x1f2615a8dde4e28ca736ff763c2078aff990043f4cbf09eb4b3a58a140a0862d"
    }

    expect(computeScriptHash(fixture.script)).toEqual(fixture.expected)
  })

})
