console.info("abc");

const axios = require("axios");
const csvwriter = require("csv-writer");
var createCsvWriter = csvwriter.createObjectCsvWriter;
(async () => {
  const userData = await axios
    .get("https://fantasy.premierleague.com/api/entry/544801/")
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.error(error);
    });

  // const userData = data;
  const classicLeagues = userData.leagues.classic;

  // if (leagues.id === 271632) {
  //   console.log(leagues.name);
  // }
  const team = classicLeagues.filter((result) => result.id === 271632);
  // console.log(team);

  const leagueStandingsData = await axios
    .get(
      "https://fantasy.premierleague.com/api/leagues-classic/" +
        team[0].id +
        "/standings"
    )
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      // console.error(error);
    });
  // console.dir(leagueStandingsData.standings.results, { depth: true });
  const userEntryData = new Map();

  for await (const userRes of leagueStandingsData.standings.results) {
    // console.log(userRes);
    const ud = await getUserData(userRes.entry);
    // console.log(ud);
    userEntryData.set(userRes.entry, ud);
  }
  console.log(userEntryData.get(544801).current);
  console.log(userEntryData.size);
  // Passing the column names intp the module
  const csvWriter = createCsvWriter({
    // Output csv file name is geek_data
    path: "geek_data.csv",
    header: [
      // Title of the columns (column_names)
      { id: "id", title: "ID" },
      { id: "event_total", title: "Event Total" },
      { id: "player_name", title: "player_name" },
      { id: "rank", title: "rank" },
      { id: "last_rank", title: "last_rank" },
      { id: "rank_sort", title: "rank_sort" },
      { id: "total", title: "total" },
      { id: "entry", title: "entry" },
      { id: "entry_name", title: "entry_name" },
    ],
  });

  // csvWriter
  //   .writeRecords(leagueStandingsData.standings.results)
  //   .then(() => console.log("Data uploaded into csv successfully"));
})();

async function getUserData(userEntryId) {
  // console.log("userEntryId", userEntryId);
  return await axios
    .get(
      "https://fantasy.premierleague.com/api/entry/" + userEntryId + "/history/"
    )
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      // console.error(error);
    });
}
