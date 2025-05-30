export function downloadCSV(csvString: string, filename: string) {
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
}

export function convertToCSV(data: Array<any>) {
    const headers = Object.keys(data[0]).join(",");
    const rows = data.map((obj) =>
        Object.values(obj)
            .map((value) => `"${value}"`)
            .join(",")
    );
    return [headers, ...rows].join("\n");
}