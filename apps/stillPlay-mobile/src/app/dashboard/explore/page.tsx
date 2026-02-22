import { Box, Stack, Typography } from "@mui/material";

export default function ExplorePage() {
  return (
    <Box sx={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <Stack spacing={3} sx={{ p: 3 }}>
        <Typography variant="h5" fontWeight={700}>
          Explore
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 2,
          }}
        >
          {[
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
          ].map((item) => (
            <Box
              key={item.label}
              component="a"
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                border: "none",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <Box
                component="img"
                src={item.src}
                alt={item.label}
                sx={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 2,
                  objectFit: "cover",
                }}
              />
            </Box>
          ))}
        </Box>
      </Stack>
    </Box>
  );
}
