import argparse
def get_args():
    parser = argparse.ArgumentParser(description='simple distributed training job based on pipeline parallelism')
    ## General settings
    parser.add_argument('--epochs', default=3, type=int, help='Total epochs to train the model')
    parser.add_argument('--batch_size', default=10, type=int, help='Input batch size on each device (default: 32)')
    parser.add_argument("--split_size", default=2, type=int, help="Number of parts of the input data")
    parser.add_argument('--log', default=None, type=int, 
                        help='Enable training logs, this action can affect to training process performance')
    ## Optimizer settings
    parser.add_argument('--lr', default=1e-3, type=float, help='learning rate')

    ## Cluster settings
    parser.add_argument('--gpu', default=None, type=int)
    # parser.add_argument('--local_rank', default=-1, type=int, 
    #                     help='local rank for distributed training')


    args = parser.parse_args()
    return args
