import { describe, it, expect } from "vitest"
import { jsonLdScriptProps } from "@/lib/jsonLd"

describe("jsonLdScriptProps", () => {
  it("returns the correct script type", () => {
    const props = jsonLdScriptProps({ "@type": "Organization" })
    expect(props.type).toBe("application/ld+json")
  })

  it("round-trips a normal object via JSON.parse", () => {
    const data = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [{ "@type": "ListItem", position: 1, name: "Hjem" }],
    }
    const { dangerouslySetInnerHTML } = jsonLdScriptProps(data)
    expect(JSON.parse(dangerouslySetInnerHTML.__html)).toEqual(data)
  })

  it("escapes </script> in string values — hostile payload cannot break out of tag", () => {
    const hostile = {
      name: '</script><script>alert(1)</script>',
      value: 42,
    }
    const { dangerouslySetInnerHTML } = jsonLdScriptProps(hostile)
    const html = dangerouslySetInnerHTML.__html

    // The literal sequence "</script" must NOT appear in the output.
    expect(html).not.toContain("</script")

    // The JSON must still parse correctly (the escaped value round-trips).
    const parsed = JSON.parse(html)
    expect(parsed.name).toBe('</script><script>alert(1)</script>')
  })

  it("escapes multiple occurrences of </ in a single value", () => {
    const data = { body: "a</b>c</d>e" }
    const { dangerouslySetInnerHTML } = jsonLdScriptProps(data)
    expect(dangerouslySetInnerHTML.__html).not.toContain("</")
    expect(JSON.parse(dangerouslySetInnerHTML.__html).body).toBe("a</b>c</d>e")
  })

  it("handles empty objects", () => {
    const props = jsonLdScriptProps({})
    expect(props.dangerouslySetInnerHTML.__html).toBe("{}")
  })

  it("handles nested objects", () => {
    const data = { a: { b: { c: "deep </script> value" } } }
    const { dangerouslySetInnerHTML } = jsonLdScriptProps(data)
    expect(dangerouslySetInnerHTML.__html).not.toContain("</script")
    expect(JSON.parse(dangerouslySetInnerHTML.__html)).toEqual(data)
  })
})
