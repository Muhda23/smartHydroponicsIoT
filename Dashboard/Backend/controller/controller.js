import {PrismaClient} from "@prisma/client"
const prisma = new PrismaClient();

// get data kontrol
export const getData = async(req, res)=> {
    try {
        const response = await prisma.DataKontrols.findMany();
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

// get data kontrol (ga tau fungsi apa ga)
export const getDatabyId = async(req, res)=> {
    try {
        const response = await prisma.DataKontrols.findUnique({
            where:{
                id: Number(req.params.id)
            }
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(404).json({msg: error.message});
    }
}

// create data kontrol
export const createData = async(req, res)=> {
    const {suhu, volume, ppm_before, ppm_after, selisih, Vnutrisi, active_pump, setpoint} = req.body;
    try {
        const data = await prisma.DataKontrols.create({
            data:{
                suhu : suhu,
                volume : volume,
                ppm_before : ppm_before,
                ppm_after : ppm_after,
                selisih : selisih,
                Vnutrisi : Vnutrisi,
                active_pump : active_pump,
                setpoint : setpoint
            }
        });
        res.status(201).json(data);
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}

// get data parameter (untuk form setting)
export const getParams = async(req, res)=> {
    try {
        const response = await prisma.parameters.findUnique({
            where:{
                id: Number(req.params.id)
            }
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(404).json({msg: error.message});
    }
}

// update data when setting get event
export const updateParams = async(req, res)=> {
    const {setpoint_atas, setpoint_bawah, panjang, lebar, tinggi, flowrate} = req.body;
    try {
        const parameters = await prisma.parameters.update({
            where : {
                id : Number(req.params.id)
            },
            data : {
                setpoint_atas : setpoint_atas,
                setpoint_bawah : setpoint_bawah,
                panjang : panjang,
                lebar : lebar,
                tinggi : tinggi, 
                flowrate : flowrate
            }
        });
        res.status(200).json(parameters);
    } catch (error) {
        res.status(400).json({msg : error.message})
    }

}
// get data parameter (untuk form setting)
export const getMonitoring = async(req, res)=> {
    try {
        const response = await prisma.dataMonitoring.findMany();
        res.status(200).json(response);
    } catch (error) {
        res.status(404).json({msg: error.message});
    }
}