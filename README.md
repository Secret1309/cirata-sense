# CIRATA-SENSE™ v2.6 DSS (HYDRA-CIRATA)

**Integrated Decision Support System untuk Ketahanan Operasional PLTA Cirata — EUREKA! ITB 2026: Industrial Case Competition (Collaborating with PT PLN Nusantara Power)**

Dikembangkan oleh **Tim Physics for Spirit — Institut Teknologi Bandung (ITB)**:
1. **Muhammad Ilham Saripul Milah** (Teknik Metalurgi - FTTM ITB)
2. **Dzaky Zahy Rabbani** (Oseanografi - FITB ITB)
- **Dosen Pembimbing:** Ir. Tria Laksana Achmad, S.T., M.T., Ph.D.

---

## 4 Modul Perhitungan Terintegrasi CIRATA-SENSE™

1. **Modul 1 — Dinamika Spasio-Temporal & Optimasi Kuota Panen (Oseanografi):**
   - Persamaan pertumbuhan logistik-ekstraksi harian: $\frac{dA}{dt} = r \cdot A(t) - H(t)$ dengan luas awal $A_0 = 430\text{ ha}$ (dari luas Waduk Cirata $6.200\text{ ha}$) dan laju tumbuh alami $r = 0,03/\text{hari}$ ($+12,90\text{ ha/hari}$).
   - Menetapkan kuota panen harian minimum $H_{\text{target}} \ge 15,0\text{–}16,0\text{ ha/hari}$ ($-3,1\text{ ha/hari}$ net) berdasarkan kecepatan transpor permukaan ($\vec{v}_{\text{drift}} = 0,85\vec{v}_{\text{inflow}} + 0,03\vec{v}_{\text{wind}}$).
2. **Modul 2 — Dekomposisi Vektor Gaya Hidrodinamika Trash Boom (Fisika):**
   - Menghitung gaya hambat pada bentangan trash boom $1,4\text{ km}$ (PE filled with PU) untuk 3 skenario debit historis (Ags 2025–Jul 2026): *Low-flow* ($72,18\text{ m}^3/\text{s}$), *Moderate-flow* ($150,80\text{ m}^3/\text{s}$), dan *High-flow* ($243,27\text{ m}^3/\text{s}$).
   - Membandingkan orientasi frontal eksisting ($\theta = 90^\circ$, beban menembus $\approx 620\text{ kN} > 577\text{ kN}$) dengan orientasi miring **HYDRA-CIRATA** ($\theta = 35^\circ$ + *viscoelastic damper* $\eta = 0,88$) yang mereduksi tegangan normal menjadi $\approx 313\text{–}330\text{ kN}$ (reduksi $>42\%$) dan memanfaatkan $81,9\%$ gaya tangensial ($F_T = F_D \cos 35^\circ$) untuk menggiring gulma pasif ke *Collection Bay* tepi.
3. **Modul 3 — Indeks Kesehatan Metalurgi Sling IWRC SS304 (Metalurgi):**
   - Mengakomodasi degradasi kekuatan tarik aktual ($T_{\text{aktual}}$) sling IWRC SS304 $\varnothing 20\text{ mm}$ dari kapasitas nominal $577\text{ kN}$ akibat *crevice corrosion* dan *corrosion fatigue* pada lingkungan ber-DO rendah ($2,0\text{ mg/L}$) dan $\text{H}_2\text{S}$ ($0,005\text{ mg/L}$).
   - Menjaga *Safety Factor* ($SF = T_{\text{aktual}} / T_{\text{normal}} \ge 1,68 \rightarrow \text{Aman}$) melalui proteksi katodik Anoda Korban (Zn-Al) + Selubung Polimer HDPE/PU.
4. **Modul 4 — Valuasi Sirkularitas Pakan KJA, Kualitas Air, & Ekonomi:**
   - Mengonversi biomassa di *Collection Bay* menjadi $48\text{ Ton/hari}$ bahan baku pelet ikan fermentasi untuk menyuplai $100.000\text{ petak KJA}$, menyerap nutrien ($\text{Total N } 1,0\text{ mg/L}$ & $\text{Total P } 0,24\text{ mg/L}$), memulihkan DO perairan ($>2,0\text{ mg/L}$, proyeksi $2,65\text{ mg/L}$) sesuai **PP No. 22 Tahun 2021 Kelas IV**, serta mengeliminasi risiko kerugian downtime ($\text{Rp17.074.290,072/jam/unit}$ atau $\text{Rp409,8 Juta/hari/unit}$).

---

## Cara Menjalankan Website DSS

```bash
npm install
npm run dev
```

Buka `http://localhost:3000` di browser.
