describe("Landing Page", () => {
  it("should launch the app, display 10 images, click analyze on third image, and verify analyze page", () => {
    // 1) Launch the app and display the landing page
    cy.visit("/");

    // Verify the landing page loads
    cy.contains("artloupe").should("be.visible");

    // Select photo option (default should be photo, but ensure it's selected)
    cy.get("select").select("photo");

    // Wait for images to load
    cy.get('[data-testid="photo-grid"]', { timeout: 10_000 }).should(
      "be.visible",
    );

    // 2) Confirm that there are 10 images displayed
    cy.get('[data-testid="artwork-card"]').should("have.length", 10);

    // 3) Click on the button "Analyze Image" for the third image
    cy.get('[data-testid="artwork-card"]')
      .eq(2)
      .within(() => {
        cy.contains("Analyze Image").click();
      });

    // 4) Verify that a new page appears with the title "Analyze Image: Urban cityscape of Chicago with towering skyscrapers and a calm street view."
    cy.url().should("include", "/analyze/");
    cy.contains(
      "Analyze Image: Urban scene of an abandoned industrial building with graffiti in Matosinhos, Portugal.",
    ).should("be.visible");

    // 5) Verify that a button "Analyze with Hugging Face" is present
    cy.contains("Analyze with Hugging Face").should("be.visible");
  });
});
