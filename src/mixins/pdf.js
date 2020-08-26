import html2pdf from 'html2pdf.js'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

export default {
  methods: {
    generateTablev2: async function (data, header, filename, firstColumnIsImage) {
      const doc = new jsPDF()
      doc.autoTable({
        head: [header],
        body: data,
        didDrawCell: (data) => {
          console.log(data)
          if (data.section === 'body' && data.column.index === 0) {
            doc.addImage(data.row.raw[0], 'JPEG', data.cell.x + 2, data.cell.y + 2, 10, 10)
          }
        }
      })
      doc.save(filename)
    },

    generateTable: async function (filename, element) {
      let options = {
        filename: filename,
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { scale: 2 },
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
