/// <reference types="cypress" />

describe("Dropzone with zero configuration", () => {
  const imageSize = 373282;
  const chunkSize = 100 * 1024;

  beforeEach(() => {
    cy.visit("/2-integrations/aws-s3-multipart.html");
  });

  it("uploads single file", () => {
    cy.intercept(
      "PUT",
      "/amazon-multipart-upload?uploadId=demo-id&partNumber=*"
    ).as("upload");
    cy.intercept("POST", "/amazon-complete").as("complete");

    cy.get(".dropzone").attachFile("image.jpg", {
      subjectType: "drag-n-drop",
    });
    let remainingSize = imageSize;
    let partEtags = [];
    for (let i = 0; i < 4; i++) {
      cy.wait("@upload").then((interception) => {
        partEtags.push(
          interception.response.headers["etag"].replaceAll('"', "")
        );
        expect(interception.request.headers["content-type"]).to.eq(
          "image/jpeg"
        );
        expect(interception.request.headers["content-length"]).to.eq(
          `${remainingSize > chunkSize ? chunkSize : remainingSize}`
        );
        expect(JSON.parse(interception.response.body)).to.deep.eq({
          success: true,
        });
        remainingSize -= chunkSize;
      });
    }

    cy.wait("@complete").then((interception) => {
      // Now making sure that the finalise request is valid as well.
      expect(interception.request.body).to.eq(
        JSON.stringify({
          // This is the demo id that we defined in the html.
          UploadId: "demo-id",
          MultipartUpload: {
            Parts: [
              // The individual etags have been returned by the server, and
              // stored in the `@upload` intercept handler.
              { PartNumber: 1, ETag: partEtags[0] },
              { PartNumber: 2, ETag: partEtags[1] },
              { PartNumber: 3, ETag: partEtags[2] },
              { PartNumber: 4, ETag: partEtags[3] },
            ],
          },
        })
      );
    });
  });
});
