import { createTestContext } from "./__helpers";

const ctx = createTestContext();

it("Ensure ", async () => {
  const draftResult = await ctx.client.request(`
    mutation {
        createDraft(title: "Nexus", body: "body1") {  
          id
          title
          body
          published
        }
      }
    `);

    console.log('draftResult ',draftResult);
    
  expect(draftResult).toMatchInlineSnapshot();

  const publishResult = await ctx.client.request(
    `
    mutation publishDraft($draftId: Int!) {
      publish(draftId: $draftId) {
        id
        title
        body
        published
      }
    }
  `,
    { draftId: draftResult.createDraft.id }
  );
  // Snapshot the published draft and expect `published` to be true
  expect(publishResult).toMatchInlineSnapshot();
});
