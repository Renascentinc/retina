import html2pdf from 'html2pdf.js'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export default {
  methods: {
    generatePdfFromObject: async function (data, header, filename, imageIndex) {
      const doc = new jsPDF()
      doc.autoTable({
        head: [header],
        body: data,
        didDrawCell: (data) => {
          if (data.section === 'body' && data.column.index === 0 && data.row.raw[imageIndex] !== null) {
            doc.addImage(data.row.raw[imageIndex], 'JPEG', data.cell.x + 2, data.cell.y + 2, 10, 10)
          }
        },
      })
      doc.save(filename)
    },

    generatePdfFromElement: async function (element, filename) {
      let options = {
        filename: filename,
        image: { type: 'png', quality: 1 },
        html2canvas: { scale: 2, allowTaint: true },
        margin: 0.5,
        pagebreak: {
          mode: 'avoid-all'
        },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      }

      try {
        await html2pdf().from(element).set(options).save()
      } catch (error) {
        throw error
      }
    }
  }
}
