import { Tab, Tabs } from "@mui/material";

interface TabBarProps {
  tabs: string[];
  selectedTab: string;
  onChange: (tab: string) => void;
}

const TabBar: React.FC<TabBarProps> = ({
  tabs,
  selectedTab,
  onChange,
}: TabBarProps) => {
  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    onChange(newValue);
  };

  return (
    <Tabs
      value={selectedTab}
      onChange={handleChange}
      indicatorColor="primary"
      textColor="primary"
      variant="fullWidth"
    >
      {tabs.map((tab) => (
        <Tab
          key={tab}
          label={tab}
          value={tab}
          sx={{
            fontWeight: 600,
            color: "#000",
            fontSize: "14px",
            fontFamily: "OpenSans",
          }}
        />
      ))}
    </Tabs>
  );
};

export default TabBar;
