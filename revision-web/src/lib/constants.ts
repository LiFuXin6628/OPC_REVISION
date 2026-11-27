export const symptoms = [
  "Nheo mắt khi nhìn xa / nhìn bảng",
  "Dụi mắt thường xuyên khi học hoặc đọc sách",
  "Chảy nước mắt bất thường hoặc cay mắt",
  "Mắt đỏ, ngứa hoặc có cảm giác cộm rát",
  "Nhìn đôi (thấy 2 hình) hoặc nhìn mờ chữ",
  "Hay kêu nhức đầu hoặc chóng mặt sau khi tập trung đọc",
  "Đưa sách, truyện hoặc tập vở quá sát mặt",
  "Lác mắt, nghiêng đầu hoặc lệch cổ khi nhìn vật",
  "Nhạy cảm, sợ hoặc chói khi ra ánh sáng mạnh",
  "Không đọc được chữ nhỏ trên bảng từ cự ly bình thường",
] as const;

export const grades = [
  "1A", "1B", "1C", "2A", "2B", "2C", "3A", "3B", "3C",
  "4A", "4B", "4C", "5A", "5B", "5C",
] as const;
export const defaultSchool = "Trường TH&THCS Chư Đang Ya";
export const genders = ["Nam", "Nữ", "Khác"] as const;
export const project = {
  location: "Gia Lai",
  email: "revision.project.opc@gmail.com",
  facebook: "https://www.facebook.com/profile.php?id=61596085415003",
  address: "268 Lý Thường Kiệt, Diên Hồng, Ho Chi Minh City, Vietnam",
  organizers: [
    { name: "Trần Anh Khoa", role: "Nhóm trưởng", phone: "0935 902 520" },
    { name: "Trần Như Ý", role: "Nhóm phó", phone: "0364 049 422" },
  ],
};
export const assets = { logo: "/assets/Logo.png", banner: "/assets/banner.png" };
export const sheetHeaders = [
  "STT", "Họ và tên học sinh", "Lớp", "Giới tính", "Ngày khám",
  ...symptoms, "Tổng số dấu hiệu phát hiện", "Ghi chú", "Thời gian nộp",
  "Trường học", "Ngày điền phiếu",
  ...["Mắt trái", "Mắt phải"].flatMap(eye => [
    `${eye} - Thị lực không kính (/10)`, `${eye} - SPH (D)`, `${eye} - CYL (D)`,
    `${eye} - AXIS (độ)`, `${eye} - Thị lực có kính (/10)`, `${eye} - Loại kính`,
  ]),
];

export function schoolDate(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en", {
    timeZone: "Asia/Ho_Chi_Minh", year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(date);
  const value = (type: string) => parts.find(part => part.type === type)?.value;
  return [value("year"), value("month"), value("day")].join("-");
}
