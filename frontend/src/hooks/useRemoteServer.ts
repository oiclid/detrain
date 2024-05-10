import { useAppDispatch, useAppSelector } from "@/controller/hooks";
import { actionNames, updateActionStatus } from "@/controller/process/processSlice";
import { setFormsProps } from "@/controller/setup/setupFormsSlice";
export async function* streamingFetch(input: RequestInfo | URL, init?: RequestInit) {

    const response = await fetch(input, init)
    const reader = response.body?.getReader();
    const decoder = new TextDecoder('utf-8');
    if (reader) {
        for (; ;) {
            const { done, value } = await reader.read()
            if (done) break;

            try {
                yield decoder.decode(value)
            }
            catch (e: any) {
                console.warn(e.message)
            }

        }
    }

}
export const useRemoteServer = () => {
    const dispatch = useAppDispatch();
    const {parallelForm, trainingScriptForm} = useAppSelector(state => state.setupForms)

    const sendCommand = async (remoteHostIP: string, command: string, outputElementId: string, rank: number) => {

        let url = `/api/stream`;

        let options = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ remoteHostIP: remoteHostIP, command: command, agentPort:  trainingScriptForm.agentPort}),
            keepalive: true,
        }
        const it = streamingFetch(url, options)
        let element = document.getElementById(outputElementId);
        for await (let value of it) {
            try {
                element?.append(value)
            } catch (e: any) {
                console.warn(e.message)
            }
        }
        dispatch(updateActionStatus({ actionName: actionNames.startTrainingAction, value: false }))
        dispatch(setFormsProps({ att: "downloadButtonEnable", value: true }))
    }

    const downloadFile = async (remoteHostIP: string, filePath: string) => {
       
        let url = `/api/file`;

        let options = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ remoteHostIP: remoteHostIP, filePath: filePath, agentPort:  trainingScriptForm.agentPort }),
        }

        const req = await fetch(url, options);

        const blob = await req.blob();
        console.log(blob)
        let href = window.URL.createObjectURL(blob);
        const a = Object.assign(document.createElement("a"), {
            href,
            style: "display:none",
            download: `${parallelForm.modelName}.pt`,
        });
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(href);
        a.remove();

    }

    return { sendCommand, downloadFile };
}