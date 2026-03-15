
// Deterministic password generation for students based on NIS
// This allows authentication without a database
export function getStudentPassword(nis: number): string {
  const base = "Tarnus";
  const nisStr = nis.toString();
  
  // Seeded shuffle for "Tarnus"
  let chars = base.split("");
  const seed = nis;
  
  // Simple deterministic shuffle
  for (let i = chars.length - 1; i > 0; i--) {
    const j = Math.abs((seed * (i + 7) + 123) % (i + 1));
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  
  // Deterministic 3 digits
  const num = Math.abs((seed * 137 + 456) % 1000);
  const numStr = num.toString().padStart(3, '0');
  
  return chars.join("") + numStr;
}

export const ADMIN_CREDENTIALS = {
  id: "2411075",
  password: "akurareti20090627"
};

export function validateLogin(email: string, password: string, isAdmin: boolean) {
  if (isAdmin) {
    if (email === ADMIN_CREDENTIALS.id && password === ADMIN_CREDENTIALS.password) {
      return {
        success: true,
        user: { id: 1, email: ADMIN_CREDENTIALS.id, role: 'admin' }
      };
    }
    return { success: false, message: "ID Admin atau Password salah." };
  }

  const studentMatch = email.match(/^(\d+)@cimahi\.tarunanusantara\.sch\.id$/);
  if (studentMatch) {
    const nis = parseInt(studentMatch[1]);
    // Range check: 2410000 to 2599999
    if (nis >= 2410000 && nis <= 2599999) {
      const expectedPassword = getStudentPassword(nis);
      if (password === expectedPassword) {
        return {
          success: true,
          user: { id: nis, email, role: 'user' }
        };
      }
      return { success: false, message: "Password salah untuk akun NIS ini." };
    }
    return { success: false, message: "NIS di luar rentang yang diizinkan (2410000 - 2599999)." };
  }

  return { success: false, message: "Akun tidak ditemukan. Gunakan format NIS@cimahi.tarunanusantara.sch.id" };
}
