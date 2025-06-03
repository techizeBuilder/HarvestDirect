import type { InsertSiteSetting } from "@shared/schema";

export const brandingData: InsertSiteSetting[] = [
  {
    key: "logo_url",
    value: null,
    type: "text",
    description: "Website logo URL"
  },
  {
    key: "facebook_url",
    value: "https://facebook.com/harvestdirect",
    type: "text", 
    description: "Facebook page URL"
  },
  {
    key: "instagram_url",
    value: "https://instagram.com/harvestdirect",
    type: "text",
    description: "Instagram profile URL"
  },
  {
    key: "twitter_url", 
    value: "https://twitter.com/harvestdirect",
    type: "text",
    description: "Twitter profile URL"
  },
  {
    key: "linkedin_url",
    value: "https://linkedin.com/company/harvestdirect",
    type: "text",
    description: "LinkedIn company page URL"
  },
  {
    key: "youtube_url",
    value: "https://youtube.com/@harvestdirect",
    type: "text",
    description: "YouTube channel URL"
  },
  {
    key: "website_url",
    value: "https://harvestdirect.com",
    type: "text",
    description: "Official website URL"
  }
];