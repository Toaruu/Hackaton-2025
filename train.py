import multiprocessing
from ultralytics import YOLO

def main():
    model = YOLO('yolov8m.pt')
    results = model.train(
        data='model/data.yaml',
        epochs=50,
        imgsz=640,
        batch=-1,
        workers=0,
        device=0,
        name='test_run_3_epochs_3',
        verbose=True
    )

    print("Sanity check training complete")

if __name__ == '__main__':
    multiprocessing.freeze_support()
    main()

