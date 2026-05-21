import { Injectable } from '@angular/core';
import { CapacitorBarcodeScanner, CapacitorBarcodeScannerCameraDirection, CapacitorBarcodeScannerOptions, CapacitorBarcodeScannerTypeHint } from '@capacitor/barcode-scanner';

@Injectable({
  providedIn: 'root',
})
export class BarcodeScannerService {

  private options : CapacitorBarcodeScannerOptions = {
    hint: CapacitorBarcodeScannerTypeHint.ALL ,
    cameraDirection:CapacitorBarcodeScannerCameraDirection.BACK,
    scanText: 'Escanear código de barras',
  }
  
 async scanQrDni(): Promise<{apellidos: string, nombres: string, dni: string}>{
    const { ScanResult, format } = await CapacitorBarcodeScanner.scanBarcode(this.options)
    const data = ScanResult.split('@');
    return {
      apellidos : data[1],
      nombres : data[2],
      dni : data[4]
    }
  }

  async scanQrGeneric(){
    const { ScanResult, format } = await CapacitorBarcodeScanner.scanBarcode(this.options);
    return ScanResult;
  }

}
