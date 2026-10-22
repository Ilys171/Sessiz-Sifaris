/**
 * Site configuration.
 *
 * Everything marked PLACEHOLDER must be replaced before the site goes public.
 */
export const siteConfig = {
  /**
   * Endpoint that receives the "Run a pilot" contact form as a POST request
   * with FormData (works with Formspree, Getform, Netlify Functions, etc.).
   * PLACEHOLDER: while this is empty the form validates input but does not send it,
   * and tells the visitor to use the contact email instead.
   */
  formEndpoint: '',

  /** PLACEHOLDER: public contact address for pilot requests. */
  contactEmail: 'pilot@example.org',

  /** Path of the privacy policy page (currently a placeholder page). */
  privacyPath: `${import.meta.env.BASE_URL}privacy/`,
} as const;
