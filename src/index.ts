import * as t from "io-ts";
import { isRight } from "fp-ts/Either";

const fooStr: unknown = "foo";
if (typeof fooStr === "string") {
  fooStr.toUpperCase();
}

try {
  throw new Error("foo");
} catch (e) {
  if (e instanceof Error) {
    console.log(e.message);
  } else {
    console.log("e is not an Error");
  }
}

const json: unknown = {
  foo: "bar",
};

type Json = {
  foo: string;
};

function isJsonType(json: unknown): json is Json {
  function hasValidShape(
    given: unknown
  ): given is Partial<Record<keyof Json, unknown>> {
    return typeof given === "object" && given !== null;
  }

  return hasValidShape(json) && typeof json.foo === "string";
}

if (isJsonType(json)) {
  json.foo; // string
}

const moreJson: unknown = {
  foo: "bar",
  baz: {
    qux: "quux",
  },
  bool: true,
};

const moreJsonType = t.type({
  foo: t.string,
  baz: t.type({
    qux: t.string,
  }),
  bool: t.boolean,
});

type ComplexJson = t.TypeOf<typeof moreJsonType>;

function isComplexJsonType(json: unknown): json is ComplexJson {
  return isRight(moreJsonType.decode(json));
}
if (isComplexJsonType(moreJson)) {
  moreJson.foo; // string
  moreJson.baz.qux; // string
  moreJson.bool; // boolean
  console.log("moreJson is ComplexJson");
} else {
  console.log("moreJson is not a ComplexJson");
}
