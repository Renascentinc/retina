import JsPDF from 'jspdf'
import 'jspdf-autotable'

export default {
  methods: {
    generateDataUrlFromObject: async function (data, header, filename, imageIndex) {
      var document = generateDocument(data, header, filename, imageIndex)
      return document.output('dataurlstring', { filename: filename })
    },

    generatePdfFromObject: async function (data, header, filename, imageIndex) {
      var document = generateDocument(data, header, filename, imageIndex)
      document.save(filename)
    }
  }
}

function generateDocument (data, header, filename, imageIndex) {
  const doc = new JsPDF()
  doc.autoTable({
    head: [header],
    body: data,
    CellDef: 30,
    didParseCell: (data) => {
      if (rowHasPhoto(data, imageIndex)) {
        // remove image url from row data, and increase height for thumbnail
        data.cell.text = ''
        data.row.height = 15
      }
    },
    didDrawCell: (data) => {
      if (rowHasPhoto(data, imageIndex)) {
        doc.addImage(data.row.raw[imageIndex], 'JPEG', data.cell.x + 2, data.cell.y + 2, 10, 10)
      }
    }
  })

  return doc
}

function rowHasPhoto (rowData, imageIndex) {
  if (imageIndex === undefined) {
    return false
  } else {
    return rowData.section === 'body' && rowData.column.index === 0 && rowData.row.raw[imageIndex] !== null
  }
}
