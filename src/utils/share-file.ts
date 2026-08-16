import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';

/** Writes text to a cache file and hands it to the OS share sheet so the user can save/send/open it. */
export async function writeAndShareFile(
  filename: string,
  content: string,
  mimeType: string,
  dialogTitle: string
): Promise<void> {
  const file = new File(Paths.cache, filename);
  if (file.exists) {
    file.delete();
  }
  file.create();
  file.write(content);

  const canShare = await Sharing.isAvailableAsync();
  if (canShare) {
    await Sharing.shareAsync(file.uri, { mimeType, dialogTitle });
  }
}
