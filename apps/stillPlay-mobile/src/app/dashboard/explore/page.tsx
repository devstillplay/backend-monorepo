import { Box, Stack, Typography } from "@mui/material";

const BOOKMAKERS = [
  {
    label: "SportyBet",
    src: "/assets/png/sportyBet.png",
    link: "https://www.sportybet.com",
  },
  {
    label: "BetKing",
    src: "/assets/png/betKing.png",
    link: "https://www.betking.com",
  },
  {
    label: "Bet9ja",
    src: "/assets/png/bet9ja.png",
    link: "https://www.bet9ja.com",
  },
  {
    label: "NairaBet",
    src: "/assets/png/nairaBet.png",
    link: "https://www.nairabet.com",
  },
] as const;

export default function ExplorePage() {
  return (
    <Box
      sx={{
        flex: 1,
        backgroundColor: { xs: "#FFFFFF", md: "transparent" },
      }}
    >
      <Stack
        spacing={{ xs: 3, md: 3 }}
        sx={{
          p: { xs: 3, md: 0 },
          maxWidth: { md: 720 },
          mx: { md: "auto" },
        }}
      >
        <Stack spacing={0.5}>
          <Typography variant="h5" fontWeight={700} sx={{ fontSize: { md: "1.35rem" } }}>
            Explore
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Quick links to bookmakers — opens in a new tab.
          </Typography>
        </Stack>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(2, minmax(0, 1fr))",
              md: "repeat(4, minmax(0, 1fr))",
            },
            gap: { xs: 2, md: 2 },
            width: "100%",
          }}
        >
          {BOOKMAKERS.map((item) => (
            <Box
              key={item.label}
              component="a"
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                display: "block",
                textDecoration: "none",
                color: "inherit",
                cursor: "pointer",
                borderRadius: 2,
                transition: "transform 0.15s ease, box-shadow 0.15s ease",
                "&:hover": {
                  transform: { md: "translateY(-2px)" },
                  boxShadow: { md: 2 },
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 2,
                  bgcolor: "grey.50",
                  border: 1,
                  borderColor: "divider",
                  aspectRatio: "4 / 3",
                  maxHeight: { xs: 132, md: 112 },
                  p: { xs: 1.25, md: 1.5 },
                  boxSizing: "border-box",
                }}
              >
                <Box
                  component="img"
                  src={item.src}
                  alt={item.label}
                  sx={{
                    width: "100%",
                    height: "100%",
                    maxWidth: { md: 140 },
                    maxHeight: { md: 72 },
                    objectFit: "contain",
                  }}
                />
              </Box>
              <Typography
                variant="caption"
                fontWeight={600}
                display="block"
                textAlign="center"
                sx={{ mt: 1, color: "text.secondary" }}
              >
                {item.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Stack>
    </Box>
  );
}
