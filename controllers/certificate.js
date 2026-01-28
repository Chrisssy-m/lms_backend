

const cloudinary = require("cloudinary").v2
const fs = require('fs');
const CertificateModel = require("../models/certificate");
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUDNAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    // secure_distribution: 'mydomain.com',
    // upload_prefix: 'https://api-eu.cloudinary.com'
});
const CertificateController = {

    create: async (req, res) => {

        try {

            const { course_id } = req.body;
            const table = await CertificateModel.findAll({});
            const dups = table?.map(x => x.course_id) || []
            
            if (dups?.includes(Number(course_id))) {
                return res.status(200).json({ message: "The certificate is already generated for this course!" });
            } else {
                const file = req.files.url;
                cloudinary.uploader.upload(file.tempFilePath, async (err, result) => {

                    fs.unlinkSync(file.tempFilePath);



                    // create course
                    const certificate = await CertificateModel.create({
                        course_id,
                        url: result.url
                    });

                    res.status(201).json({
                        message: "Certificate generated successfully!",
                        certificate
                    });
                })
            }


        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },


    update: async (req, res) => {

        try {

            const file = req?.files?.url;
            if (file) {
                cloudinary.uploader.upload(file.tempFilePath, async (err, result) => {
                    fs.unlinkSync(file.tempFilePath);
                    console.log('result', result);

                    const { course_id } = req.body;

                    const _id = parseInt(req.params.id, 10);
                    const url = result?.url || null;
                    const certificate = await CertificateModel.update({
                        _id, course_id, url
                    });

                    res.status(201).json({
                        message: "Certificate updated successfully",
                        certificate
                    });
                })
            } else {
                const { _id, course_id, url } = req.body;
                const certificate = await CertificateModel.update({
                    _id, course_id, url
                });

                res.status(201).json({
                    message: "Certificate updated successfully",
                    certificate
                });
            }



        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    getAll: async (req, res) => {
        try {
            const { page, size } = req.query

            const users = await CertificateModel.findAll({ page, size });
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getById: async (req, res) => {
        try {
            const certificate = await CertificateModel.findById(req.params.id);
            if (!certificate) {
                return res.status(404).json({ message: "certificate not found" });
            }
            res.json(certificate);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    delete: async (req, res) => {
        try {
            const certificate = await CertificateModel.deleteById(req.params.id);
            if (!certificate) {
                return res.status(400).json({ message: "Certificate not found!" });
            }
            return res.status(200).json({ message: "Certificate deleted successfully!" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getFilters: async (req, res) => {
        try {
            const { col, row } = req.query; // ✅ FIX

            if (!col || !row) {
                return res.status(400).json({ error: 'col and row are required' });
            }

            const users = await CertificateModel.findFilterRecords({ col, row });

            res.status(200).json(users);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    },

};

module.exports = CertificateController;
