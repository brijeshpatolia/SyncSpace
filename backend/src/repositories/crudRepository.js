export default function crudRepository(schema) {
  // Capture the schema in a local variable
  const model = schema

  return {
    model, // Optional: you can still expose the model if needed

    create: async (data) => {
      try {
        const newDoc = await model.create(data)
        return newDoc
      } catch (error) {
        console.error('Error creating document:', error)
        throw error
      }
    },

    getAll: async () => {
      try {
        const allDocs = await model.find()
        return allDocs
      } catch (error) {
        console.error('Error fetching documents:', error)
        throw error
      }
    },

    getById: async (id) => {
      try {
        const doc = await model.findById(id)
        return doc
      } catch (error) {
        console.error('Error fetching document by id:', error)
        throw error
      }
    },

    delete: async (id) => {
      try {
        const response = await model.findByIdAndDelete(id)
        return response
      } catch (error) {
        console.error('Error deleting document:', error)
        throw error
      }
    },

    update: async (id, data) => {
      try {
        const updatedDoc = await model.findByIdAndUpdate(id, data, {
          new: true
        })
        return updatedDoc
      } catch (error) {
        console.error('Error updating document:', error)
        throw error
      }
    },
    deleteMany: async function (modelIds) {
      const response = await model.deleteMany({ _id: { $in: modelIds } })
      return response;
    }
  }
}
