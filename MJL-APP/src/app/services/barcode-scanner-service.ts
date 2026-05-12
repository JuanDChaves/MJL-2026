import { Injectable } from '@angular/core';
import { CapacitorBarcodeScanner, CapacitorBarcodeScannerCameraDirection, CapacitorBarcodeScannerOptions, CapacitorBarcodeScannerTypeHint } from '@capacitor/barcode-scanner';

@Injectable({
  providedIn: 'root',
})
export class BarcodeScannerService {
  
 async scanBarcode(): Promise<{apellidos: string, nombres: string, dni: string}>{
    let options: CapacitorBarcodeScannerOptions = {
      hint: CapacitorBarcodeScannerTypeHint.ALL ,
      cameraDirection:CapacitorBarcodeScannerCameraDirection.BACK,
      scanText: 'Escanear código de barras',
    }

    const { ScanResult, format } = await CapacitorBarcodeScanner.scanBarcode(options)
    const data = ScanResult.split('@');
    return {
      apellidos : data[1],
      nombres : data[2],
      dni : data[4]
    }
  }

}
