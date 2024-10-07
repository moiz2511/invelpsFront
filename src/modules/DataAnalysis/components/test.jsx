import React from "react";

const test = () => {
  return (
    <Grid
      container
      sx={{
        fontFamily: "Montserrat",
        width: "100%",
      }}
    >
      {isSwitch2 ? (
        <>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              maxWidth: "100%",
              // position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "auto",
              backgroundColor: "white",
              zIndex: 1,
              overflowX: "hidden",
              overflowY: "auto",
            }}
          >
            <Card
              sx={{
                display: "flex",
                flexDirection: "column",
                padding: 1,
              }}
            >
              {/* Companies Per Country, sector, market */}
              <Box
                sx={{
                  display: "grid",
                  justifyContent: "space-around",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "1fr",
                    md: "1.5fr 1fr",
                  },
                  gap: 2,
                  my: 2,
                }}
              >
                <Card
                  sx={{
                    padding: 4,
                    gap: 3,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <text style={{ fontWeight: "bolder" }}>
                    {" "}
                    Companies Per Country (%){" "}
                  </text>
                  <GeoChartComponent data={mapsData} />
                </Card>

                <Box
                  style={{ display: "flex", gap: 6, flexDirection: "column" }}
                >
                  <Card
                    sx={{
                      padding: 2,
                    }}
                  >
                    <text style={{ fontWeight: "bolder" }}>
                      {" "}
                      Companies Per Sector (%){" "}
                    </text>
                    <HorizontalBarChart
                      onClickBar={handleBarClick}
                      data={perSectorKPI}
                    />
                  </Card>
                  <Card
                    sx={{
                      padding: 4,
                      paddingBottom: { xs: 8, md: 4 },
                      display: "flex",
                      flexDirection: "column",
                      height: 250,
                    }}
                  >
                    <text style={{ fontWeight: "bolder" }}>
                      {" "}
                      Companies Per Market Cap (%){" "}
                    </text>
                    <DonutPieChart
                      data={perMarketKPI}
                      dataKey={"total_count"}
                      nameKey={"market_cap_class"}
                    ></DonutPieChart>
                    {/* <PieChart
                    graphData={perMarketKPI}
                    nameData={(item) => item.market_cap_class}
                  /> */}
                  </Card>
                </Box>
              </Box>
              <CompaniesPassingCriteria
                graphTableDataCopy={graphTableDataCopy}
                passingHeadCells={passingHeadCells}
                onClickFilter={(event, key) => {
                  handleHeaderClick(key);
                  setAnchorEl(event.currentTarget);
                }}
                onClickTableBody={() => {
                  setSelectedCompany(data);
                  setIsSwitch1(true);
                  setIsSwitch2(false);
                  setShowVisualData(!showVisualData);
                }}
                // normal props
                criteriaRef={criteriaRef}
                selectedItems={selectedItems}
                setSelectedItems={setSelectedItems}
                passingCriteria={passingCriteria}
                companySortBy={companySortBy}
                companyOrderBy={companyOrderBy}
                setCompanySortBy={setCompanySortBy}
                setCompanyOrderBy={setCompanyOrderBy}
                currentRowsPerPage={currentRowsPerPage}
                setCurrentRowsPerPage={setCurrentRowsPerPage}
                setOpenFilter={setOpenFilter}
                openFilter={openFilter}
                anchorEl={anchorEl}
                items={uniqueCompanies}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={totalPages}
                isLoading={isLoading}
                setIsSort={setIsSort}
              />
            </Card>
          </div>
        </>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",

            gap: 5,
          }}
        >
          {/* strategies */}
          <Card
            sx={{
              my: 1,
              position: "relative",
              width: "calc(100vw - 30px)",
              overflowX: "hidden",
              boxShadow: "none",
            }}
          >
            <Box px={2} py={2} width={"100%"}>
              <Box spacing={1} sx={{ mt: 0.5 }}>
                <text
                  style={{
                    padding: "5px",
                    fontSize: "27px",
                    fontWeight: "bold",
                  }}
                >
                  Strategies Performances and Risks{" "}
                  <span style={{ color: "gray" }}>
                    ({strategiesCopy?.[0]?.duration}years)
                  </span>
                </text>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  marginTop: 6,
                  overflowX: "hidden",
                }}
              >
                {allStrategies?.length > 0 ? (
                  <>
                    <VerticalBarChart
                      chartId={"bar-chart-1"}
                      graphData={allStrategies}
                    />

                    <VerticalBarChart
                      chartId={"bar-chart-2"}
                      graphData={allStrategies}
                    />

                    <VerticalBarChart
                      chartId={"bar-chart-3"}
                      graphData={allStrategies}
                    />
                  </>
                ) : (
                  <h1>Fetching...</h1>
                )}
              </Box>
            </Box>
          </Card>
          {/* overview 3y chart */}
          <OverviewTableData
            strategiesCopy={strategiesCopy}
            allStrategies={allStrategies}
            sOrderBy={sOrderBy}
            setSOrderBy={setSOrderBy}
            sSortBy={sSortBy}
            setSSortBy={setSSortBy}
            headCells={headCells}
            setOpenFilter={setOpenFilter}
            openFilter={openFilter}
            anchorEl={anchorEl}
            items={uniqueCompanies}
            selectedItems={selectedItems}
            setSelectedItems={setSelectedItems}
            onClickVisualization={(data) => handleDataVisualization(data)}
            onClickInvestorVisualization={() =>
              handleInvestorVisualization(data.investors)
            }
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        </div>
      )}

      {showInvestor && (
        <InvestorModal
          showInvestor={showInvestor}
          closeInvestorModal={closeInvestorModal}
          investor={selectedInvestor}
        />
      )}
    </Grid>
  );
};

export default test;
// const [uniqueExchanges, setUniqueExchanges] = useState([
//   "National Stock Exchange Of India",
//   "Taipei Exchange",
//   "NASDAQ Global Market",
//   "Athens Stock Exchange",
//   "Six Swiss Exchange",
//   "Hong Kong Exchange",
//   "Frankfurt Stock Exchange",
//   "London Stock Exchange",
//   "Shenzhen Stock Exchange",
//   "Johannesburg Stock Exchange",
//   "New York Stock Exchange",
//   "NASDAQ Capital Market",
//   "Korea Exchange",
//   "Shanghai Stock Exchange",
//   "Nyse Euronext - Euronext Brussels",
//   "Euronext Paris",
//   "Australian Securities Exchange",
//   "Tokyo Stock Exchange",
//   "Bombay Stock Exchange",
//   "Toronto Stock Exchange Ventures",
//   "Madrid Stock Exchange",
// ]);
// const [uniqueIndustries, setUniqueIndustries] = useState([
//   "Information Technology Services",
//   "Manufacturing - Tools & Accessories",
//   "Software - Application",
//   "Semiconductors",
//   "Banks - Regional",
//   "Oil & Gas Exploration & Production",
//   "Financial - Capital Markets",
//   "Communication Equipment",
//   "Software - Services",
//   "Software - Infrastructure",
//   "Real Estate - Services",
//   "Chemicals - Specialty",
//   "Coal",
//   "Apparel - Manufacturers",
//   "Drug Manufacturers - Specialty & Generic",
//   "Auto - Dealerships",
//   "Airlines, Airports & Air Services",
//   "Medical - Instruments & Supplies",
//   "Biotechnology",
//   "Drug Manufacturers - General",
//   "Beverages - Wineries & Distilleries",
//   "Gambling, Resorts & Casinos",
//   "Chemicals",
//   "Medical - Devices",
//   "Beverages - Alcoholic",
//   "Household & Personal Products",
//   "Leisure",
//   "Medical - Healthcare Information Services",
//   "Hardware, Equipment & Parts",
//   "Entertainment",
//   "Education & Training Services",
//   "Specialty Retail",
//   "Electronic Gaming & Multimedia",
//   "Auto - Parts",
//   "Medical - Pharmaceuticals",
// ]);
// const [uniqueSectors, setUniqueSectors] = useState([
//   "Technology",
//   "Industrials",
//   "Financial Services",
//   "Energy",
//   "Real Estate",
//   "Basic Materials",
//   "Consumer Cyclical",
//   "Healthcare",
//   "Utilities",
//   "Communication Services",
// ]);

// const fetchGraphTableData = async () => {
//   try {
//     setIsLoading(true);
//     console.log("1");
//     console.log(selectedStrategy);
//     const body = {
//       strategy_name: selectedStrategy?.name,
//       page: currentPage,
//       data_per_page: isBarClick ? 300 : currentRowsPerPage,
//     };

//     console.log(isSort);
//     if (isSort) {
//       if (companyOrderBy) {
//         body.order_by = companyOrderBy;
//         console.log("here");
//       }
//       if (companySortBy) {
//         body.sort_by = companySortBy;
//       }
//     }
//     const response = await restService.getStrategyTableData(body);
//     if (response.status === 200) {
//       const data = response.data;
//       console.log(data.data);
//       console.log(isBarClick);

//       console.log(selectedCountry);
//       if (selectedCountry) {
//         const filteredData = data.data.filter((item) =>
//           selectedCountry.some(
//             (selectedItem) =>
//               selectedItem === item.country
//           )
//         );
//         setGraphTableData(filteredData);
//         setGraphTableDataCopy(filteredData);

//         console.log(graphTableDataCopy);
//         console.log(graphTableData);
//         console.log(filteredData);

//         if (criteriaRef.current) {
//           criteriaRef.current.scrollIntoView({ behavior: "smooth" });
//         }
//       }

//       } else {
//         setGraphTableData(data.data);
//         setGraphTableDataCopy(data.data);
//         console.log(graphTableDataCopy);
//         console.log(graphTableData);
//       }

//       setTotalPages(data.paginator.total_pages);
//       setPassingCriteria(data.companies_passing_criteris);

//     } else {
//       console.log("Unexpected status code:", response.status);
//       setIsLoading(false);
//     }
//   } catch (error) {
//     console.error("Error fetching data:", error);
//     setIsLoading(false);
//   } finally {
//     setIsLoading(false);
//   }
// };
