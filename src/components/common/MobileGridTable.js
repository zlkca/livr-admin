export default function MobileGrid() {
  return (
    <div style={{ height: 800 }}>
      {data.map((row, index) => {
        return (
          <div style={{ height: 100 }} key={index} onClick={() => handleRowClick(row)}>
            {row.name}
          </div>
        );
      })}
    </div>
  );
}
