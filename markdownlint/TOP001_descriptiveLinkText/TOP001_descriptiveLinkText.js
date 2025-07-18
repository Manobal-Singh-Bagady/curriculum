module.exports = {
  names: ["TOP001", "descriptive-link-text-labels"],
  description: "Links have descriptive text labels",
  tags: ["accessibility", "links"],
  parser: "markdownit",
  information: new URL(
    "https://github.com/TheOdinProject/curriculum/blob/main/markdownlint/docs/TOP001.md"
  ),
  function: function TOP001(params, onError) {
    const tokensWithLinks = params.parsers.markdownit.tokens?.filter((token) =>
      token.children?.some((child) => child.type === "link_open")
    );
    const childrenOfTokensWithLinks = tokensWithLinks
      .map((tokenWithLink) => tokenWithLink.children)
      .flat();
    const linkOpenTokenIndices = childrenOfTokensWithLinks
      .filter((token) => token.type === "link_open")
      .map((linkToken) => childrenOfTokensWithLinks.indexOf(linkToken));

    linkOpenTokenIndices.forEach((linkOpenIndex) => {
      const tokensAfterLinkOpen =
        childrenOfTokensWithLinks.slice(linkOpenIndex);
      const linkContentTokens = tokensAfterLinkOpen.slice(
        1,
        tokensAfterLinkOpen.findIndex((token) => token.type === "link_close")
      );
      const linkContentString = linkContentTokens
        .map((token) =>
          token.type === "code_inline" ? `\`${token.content}\`` : token.content
        )
        .join("");

      // https://regexr.com/7sdtj to test the following regex against the link text itself
      const isInvalid = /.*?(?<!(\w|`))(this|here)(?!(\w|`)).*?/i.test(
        linkContentString
      );
      if (isInvalid) {
        const linkUrl = tokensAfterLinkOpen[0].attrs[0][1];
        onError({
          lineNumber: tokensAfterLinkOpen[0].lineNumber,
					detail: `Expected text to not include the words "this" or "here". Use a more descriptive text that clearly conveys the purpose or content of the link.`,
          context: `[${linkContentString}](${linkUrl})`,
        });
      }
    });
  },
};
