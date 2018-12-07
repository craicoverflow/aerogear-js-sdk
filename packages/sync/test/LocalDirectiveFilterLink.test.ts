import { expect } from "chai";
import { requestWithOnlineDirective, requestWithNoSquashDirective } from "./operations";
import {
  TestLink
} from "./TestUtils";
import { ApolloLink, execute } from "apollo-link";
import { LocalDirectiveFilterLink } from "../src/links/LocalDirectiveFilterLink";
import { hasDirectives } from "apollo-utilities";

describe("LocalDirectives", () => {
  const directiveFilterLink = new LocalDirectiveFilterLink();
  let testLink: TestLink;
  let link: ApolloLink;

  beforeEach(() => {
    testLink = new TestLink();
    link = ApolloLink.from([directiveFilterLink, testLink]);
  });

  it("ensures online only directive does not exist after local link", () => {
    expect(hasDirectives(["onlineOnly"], requestWithOnlineDirective.query));
    execute(link, requestWithOnlineDirective).subscribe({});
    expect(testLink.operations.length).equal(1);
    expect(!(hasDirectives(["onlineOnly"], testLink.operations[0].query)));
  });

  it("ensures no squash directive does not exist after local link", () => {
    expect(hasDirectives(["noSquash"], requestWithNoSquashDirective.query));
    execute(link, requestWithNoSquashDirective).subscribe({});
    expect(testLink.operations.length).equal(1);
    expect(!(hasDirectives(["noSquash"], testLink.operations[0].query)));
  });
});
