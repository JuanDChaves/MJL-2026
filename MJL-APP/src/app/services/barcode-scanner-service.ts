import { Injectable } from '@angular/core';
import { CapacitorBarcodeScanner, CapacitorBarcodeScannerCameraDirection, CapacitorBarcodeScannerOptions, CapacitorBarcodeScannerTypeHint } from '@capacitor/barcode-scanner';

@Injectable({
  providedIn: 'root',
})
export class BarcodeScannerService {
  
 async scanBarcode(){
    let options: CapacitorBarcodeScannerOptions = {
      hint: CapacitorBarcodeScannerTypeHint.ALL ,
      cameraDirection:CapacitorBarcodeScannerCameraDirection.BACK,
      scanText: 'Escanear código de barras',
    }

    return await CapacitorBarcodeScanner.scanBarcode(options)
  }

}
