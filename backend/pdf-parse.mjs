import pdf from "pdf-parse-debugging-disabled";

const data = await pdf("./uploads/test.pdf");
console.log(data);
