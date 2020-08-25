import html2pdf from 'html2pdf.js'

export default {
  methods: {
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
