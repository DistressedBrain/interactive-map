/* ============================================================
   WIDGET CONFIG (bento grid)
   To add a new topic to the homepage: copy one block below,
   paste it at the end of the list, change the values. Done.

   tag:     small label in the card's top-left corner
   variant: "dark"   -> dark card (default look)
            "light"  -> bright paper card for contrast
            "accent" -> card fully colored in its accent color
   media:   null                  -> stylish card with color blob
            "assets/picture.jpg"  -> full-bleed image card
            "assets/clip.mp4"     -> full-bleed looping video card
   cs / rs: card size in grid units, cs = width (1-6 columns),
            rs = height (1-4 rows). The dev page can override this.
   r:       corner roundness in pixels
   ============================================================ */

const WIDGETS = [
  {
    id: "topic-1",
    tag: "Plate 01",
    title: "Gacha Games",
    subtitle: "A list of all available gacha game maps",
    link: "pages/topic-1.html",
    media: "https://i.ytimg.com/vi/9BgT3xLCUe4/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLB89-RRF7YFcx4-YsCIkLGXTBRyXQ",
    variant: "dark",
    accent: "#d4a24e",
    cs: 3, rs: 2, r: 18
  },
  {
    id: "topic-2",
    tag: "Plate 02",
    title: "Topic Two",
    subtitle: "Not yet charted",
    link: "pages/topic-2.html",
    media: null,
    variant: "accent",
    accent: "#4ecdc4",
    cs: 1, rs: 2, r: 18
  },
  {
    id: "topic-3",
    tag: "Plate 03",
    title: "Topic Three",
    subtitle: "Not yet charted",
    link: "pages/topic-3.html",
    media: null,
    variant: "light",
    accent: "#e07a5f",
    cs: 2, rs: 3, r: 18
  },
  {
    id: "topic-4",
    tag: "Plate 04",
    title: "Topic Four",
    subtitle: "Not yet charted",
    link: "pages/topic-4.html",
    media: null,
    variant: "dark",
    accent: "#7fb069",
    cs: 2, rs: 2, r: 18
  },
  {
    id: "topic-5",
    tag: "Plate 05",
    title: "Topic Five",
    subtitle: "Not yet charted",
    link: "pages/topic-5.html",
    media: null,
    variant: "accent",
    accent: "#6aa9d4",
    cs: 2, rs: 2, r: 18
  },
  {
    id: "topic-6",
    tag: "Plate 06",
    title: "Global map",
    subtitle: "The map of the world, not yet chategorized",
      link: "pages/topic-6.html",
      media: "https://www.gstatic.com/earth/social/00_generic_facebook-001.jpg",
    variant: "dark",
    accent: "#b48ead",
    cs: 2, rs: 1, r: 18
    }
];
